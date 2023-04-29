using Newtonsoft.Json;
using System.Collections;
using System.Collections.Generic;
using System.Xml.Linq;

namespace LooserPGC
{
    internal class Program
    {
        public static Element[] elements;
        public static Dictionary<string, int> recipes;

        public static void LoadJson()
        {
            using (StreamReader r = new StreamReader("database.json")) 
            {
                string json = r.ReadToEnd();
                Database db = JsonConvert.DeserializeObject<Database>(json);
                elements = db.elements.ToArray();
                recipes = db.recipes;
            }
        }
        public static void SaveJson(Database d)
        {
            using (StreamWriter file = File.CreateText("output.json"))
            {
                JsonSerializer serializer = new JsonSerializer();
                serializer.Serialize(file, d);
            }
        }

        public static void Main()
        {
            LoadJson();
            for(int j = 0; j < 4; j++)
            {
                elements[j].depth = 0;
            }
            
            for(int i = 0; i < 10; i++)
            {
                foreach (KeyValuePair<string, int> recipe in recipes)
                {
                    CalcDepth(int.Parse(recipe.Key.Split(".")[0]), int.Parse(recipe.Key.Split(".")[1]), recipe.Value);
                }
            }
            Database d = new Database();
            d.recipes = recipes;
            d.elements = new List<Element>(elements);
            SaveJson(d);
        }
        public static void CalcDepth(int i1, int i2, int r) 
        {
            if (r < 4) return;

            int depth = elements[i1].depth + elements[i2].depth + 1;

            List<int> d1 = new List<int>();
            d1.Add(i1);
            d1.AddRange(elements[i1].discovered);

            List<int> d2 = new List<int>();
            d2.Add(i2);
            d2.AddRange(elements[i2].discovered);
            while (d1.Count > 0)
            {
                foreach (int e in d2)
                {
                    if (d1.Count > 0 && e == d1[0])
                    {
                        depth -= elements[e].depth;
                        foreach (int remove in elements[e].discovered)
                        {
                            d1.Remove(remove);
                            if (d1.Count == 0)
                                break;
                        }
                        break;
                    }
                }
                if (d1.Count > 0)
                    d1.RemoveAt(0);
            }

            if (elements[r].depth > depth || elements[r].depth == 0)
            {
                elements[r].discovered = new List<int>();
                elements[r].discovered.AddRange(elements[i1].discovered);
                elements[r].discovered.Add(i1);
                elements[r].discovered.AddRange(elements[i2].discovered);
                elements[r].discovered.Add(i2);
                elements[r].discovered = elements[r].discovered.Distinct().ToList();
                elements[r].discovered.Sort(new SortByDepth());
                elements[r].depth = depth;
            }
        }
        public static string[] GetRecipes(int element)
        {
            List<string> rec = new List<string>();
            foreach (KeyValuePair<string, int> recipe in recipes)
            {
                if (recipe.Value == element) rec.Add(recipe.Key);
            }
            return rec.ToArray();
        }
        public class SortByDepth : IComparer<int>
        {
            int IComparer<int>.Compare(int x, int y)
            {
                return new CaseInsensitiveComparer().Compare(elements[y].depth, elements[x].depth);
            }
        }
    }
    public class Database
    {
        public List<Element> elements;
        public Dictionary<string, int> recipes;
    }
    public class Element
    {
        public string name;
        public string stripped;
        public string description;
        public string textureprompt;
        public List<int> discovered = new List<int>();
        public int depth;
    }
}